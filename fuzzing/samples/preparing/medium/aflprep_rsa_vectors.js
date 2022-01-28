function getTestVectors() {
    var pkcs8 = new Uint8Array([48, 130, 4, 191, 2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130, 4, 169, 48, 130, 4, 165, 2, 1, 0, 2, 130, 1, 1, 0, 211, 87, 96, 146, 230, 41, 87, 54, 69, 68, 231, 228, 35, 59, 123, 219, 41, 61, 178, 8, 81, 34, 196, 121, 50, 133, 70, 249, 240, 247, 18, 246, 87, 196, 177, 120, 104, 201, 48, 144, 140, 197, 148, 247, 237, 0, 192, 20, 66, 193, 175, 4, 194, 246, 120, 164, 139, 162, 200, 15, 209, 113, 62, 48, 181, 172, 80, 120, 122, 195, 81, 101, 137, 241, 113, 150, 127, 99, 134, 173, 163, 73, 0, 166, 187, 4, 238, 206, 164, 43, 240, 67, 206, 217, 160, 249, 77, 12, 192, 158, 145, 155, 157, 113, 102, 192, 138, 182, 206, 32, 70, 64, 174, 164, 196, 146, 13, 182, 216, 110, 185, 22, 208, 220, 192, 244, 52, 26, 16, 56, 4, 41, 231, 225, 3, 33, 68, 234, 148, 157, 232, 246, 192, 204, 191, 149, 250, 142, 146, 141, 112, 216, 163, 140, 225, 104, 219, 69, 246, 241, 52, 102, 61, 111, 101, 111, 92, 234, 188, 114, 93, 168, 192, 42, 171, 234, 170, 19, 172, 54, 167, 92, 192, 186, 225, 53, 223, 49, 20, 182, 101, 137, 199, 237, 60, 182, 21, 89, 174, 90, 56, 79, 22, 43, 250, 128, 219, 228, 97, 127, 134, 195, 241, 208, 16, 201, 79, 226, 201, 191, 1, 154, 110, 99, 179, 239, 192, 40, 212, 60, 238, 97, 28, 133, 236, 38, 60, 144, 108, 70, 55, 114, 198, 145, 27, 25, 238, 192, 150, 202, 118, 236, 94, 49, 225, 227, 2, 3, 1, 0, 1, 2, 130, 1, 1, 0, 139, 55, 92, 203, 135, 200, 37, 197, 255, 61, 83, 208, 9, 145, 110, 150, 65, 5, 126, 24, 82, 114, 39, 160, 122, 178, 38, 190, 16, 136, 129, 58, 59, 56, 187, 123, 72, 243, 119, 5, 81, 101, 250, 42, 147, 57, 210, 77, 198, 103, 213, 197, 186, 52, 39, 230, 164, 129, 23, 110, 172, 21, 255, 212, 144, 104, 49, 30, 28, 40, 59, 159, 58, 142, 12, 184, 9, 180, 99, 12, 80, 170, 143, 62, 69, 166, 11, 53, 158, 25, 191, 140, 187, 94, 202, 214, 78, 118, 31, 16, 149, 116, 63, 243, 106, 175, 92, 240, 236, 185, 127, 237, 173, 221, 166, 11, 91, 243, 93, 129, 26, 117, 184, 34, 35, 12, 250, 160, 25, 47, 173, 64, 84, 126, 39, 84, 72, 170, 51, 22, 191, 142, 43, 76, 224, 133, 79, 199, 112, 139, 83, 123, 162, 45, 19, 33, 11, 9, 174, 195, 122, 39, 89, 239, 192, 130, 161, 83, 27, 35, 169, 23, 48, 3, 125, 222, 78, 242, 107, 95, 150, 239, 220, 195, 159, 211, 76, 52, 90, 213, 28, 187, 228, 79, 229, 139, 138, 59, 78, 201, 151, 134, 108, 8, 109, 255, 27, 136, 49, 239, 10, 31, 234, 38, 60, 247, 218, 205, 3, 192, 76, 188, 194, 178, 121, 229, 127, 165, 185, 83, 153, 107, 251, 29, 214, 136, 23, 175, 127, 180, 44, 222, 247, 165, 41, 74, 87, 250, 194, 184, 173, 115, 159, 27, 2, 153, 2, 129, 129, 0, 251, 248, 51, 194, 198, 49, 201, 112, 36, 12, 142, 116, 133, 240, 106, 62, 162, 168, 72, 34, 81, 26, 134, 39, 221, 70, 78, 248, 175, 175, 113, 72, 209, 164, 37, 182, 184, 101, 125, 221, 82, 70, 131, 43, 142, 83, 48, 32, 197, 187, 181, 104, 133, 90, 106, 236, 62, 66, 33, 215, 147, 241, 220, 91, 47, 37, 132, 226, 65, 94, 72, 233, 162, 189, 41, 43, 19, 64, 49, 249, 156, 142, 180, 47, 192, 188, 208, 68, 155, 242, 44, 230, 222, 201, 112, 20, 239, 229, 172, 147, 235, 232, 53, 135, 118, 86, 37, 44, 187, 177, 108, 65, 91, 103, 177, 132, 210, 40, 69, 104, 162, 119, 213, 147, 53, 88, 92, 253, 2, 129, 129, 0, 214, 184, 206, 39, 199, 41, 93, 93, 22, 252, 53, 112, 237, 100, 200, 218, 147, 3, 250, 210, 148, 136, 193, 166, 94, 154, 215, 17, 249, 3, 112, 24, 125, 187, 253, 129, 49, 109, 105, 100, 139, 200, 140, 197, 200, 53, 81, 175, 255, 69, 222, 186, 207, 182, 17, 5, 247, 9, 228, 195, 8, 9, 185, 0, 49, 235, 214, 134, 36, 68, 150, 198, 246, 158, 105, 46, 189, 200, 20, 246, 66, 57, 244, 173, 21, 117, 110, 203, 120, 197, 165, 176, 153, 49, 219, 24, 48, 119, 197, 70, 163, 140, 76, 116, 56, 137, 173, 61, 62, 208, 121, 181, 98, 46, 208, 18, 15, 160, 225, 249, 59, 89, 61, 183, 216, 82, 224, 95, 2, 129, 128, 56, 135, 75, 157, 131, 247, 129, 120, 206, 45, 158, 252, 23, 92, 131, 137, 127, 214, 127, 48, 107, 191, 166, 159, 100, 238, 52, 35, 104, 206, 212, 124, 128, 195, 241, 206, 23, 122, 117, 141, 100, 186, 251, 12, 151, 134, 164, 66, 133, 250, 1, 205, 236, 53, 7, 205, 238, 125, 201, 183, 226, 178, 29, 60, 187, 204, 16, 14, 238, 153, 103, 132, 59, 5, 115, 41, 253, 204, 166, 41, 152, 237, 15, 17, 179, 140, 232, 176, 171, 199, 222, 57, 1, 124, 113, 207, 208, 174, 87, 84, 108, 85, 145, 68, 205, 208, 175, 208, 100, 95, 126, 168, 255, 7, 185, 116, 209, 237, 68, 253, 31, 142, 0, 245, 96, 191, 109, 69, 2, 129, 129, 0, 133, 41, 239, 144, 115, 207, 143, 123, 95, 249, 226, 26, 186, 223, 58, 65, 115, 211, 144, 6, 112, 223, 175, 89, 66, 106, 188, 223, 4, 147, 193, 61, 47, 29, 27, 70, 184, 36, 166, 172, 24, 148, 179, 217, 37, 37, 12, 24, 30, 52, 114, 193, 96, 120, 5, 110, 177, 154, 141, 40, 247, 31, 48, 128, 146, 117, 52, 129, 212, 148, 68, 253, 247, 140, 158, 166, 194, 68, 7, 220, 1, 142, 119, 211, 175, 239, 56, 91, 47, 247, 67, 158, 150, 35, 121, 65, 51, 45, 212, 70, 206, 190, 255, 219, 68, 4, 254, 79, 113, 89, 81, 97, 208, 22, 64, 44, 51, 77, 15, 87, 198, 26, 190, 79, 249, 244, 203, 249, 2, 129, 129, 0, 135, 216, 119, 8, 212, 103, 99, 228, 204, 190, 178, 209, 233, 113, 46, 91, 240, 33, 109, 112, 222, 148, 32, 165, 178, 6, 155, 116, 89, 185, 159, 93, 159, 127, 47, 173, 124, 215, 154, 174, 230, 122, 127, 154, 52, 67, 126, 60, 121, 168, 74, 240, 205, 141, 233, 223, 242, 104, 235, 12, 71, 147, 245, 1, 249, 136, 213, 64, 246, 211, 71, 92, 32, 121, 184, 34, 122, 35, 217, 104, 222, 196, 227, 198, 101, 3, 24, 113, 147, 69, 150, 48, 71, 43, 253, 182, 186, 29, 231, 134, 199, 151, 250, 111, 78, 166, 90, 42, 132, 25, 38, 47, 41, 103, 136, 86, 203, 115, 201, 189, 75, 200, 155, 94, 4, 27, 34, 119]);
    var spki = new Uint8Array([48, 130, 1, 34, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 130, 1, 15, 0, 48, 130, 1, 10, 2, 130, 1, 1, 0, 211, 87, 96, 146, 230, 41, 87, 54, 69, 68, 231, 228, 35, 59, 123, 219, 41, 61, 178, 8, 81, 34, 196, 121, 50, 133, 70, 249, 240, 247, 18, 246, 87, 196, 177, 120, 104, 201, 48, 144, 140, 197, 148, 247, 237, 0, 192, 20, 66, 193, 175, 4, 194, 246, 120, 164, 139, 162, 200, 15, 209, 113, 62, 48, 181, 172, 80, 120, 122, 195, 81, 101, 137, 241, 113, 150, 127, 99, 134, 173, 163, 73, 0, 166, 187, 4, 238, 206, 164, 43, 240, 67, 206, 217, 160, 249, 77, 12, 192, 158, 145, 155, 157, 113, 102, 192, 138, 182, 206, 32, 70, 64, 174, 164, 196, 146, 13, 182, 216, 110, 185, 22, 208, 220, 192, 244, 52, 26, 16, 56, 4, 41, 231, 225, 3, 33, 68, 234, 148, 157, 232, 246, 192, 204, 191, 149, 250, 142, 146, 141, 112, 216, 163, 140, 225, 104, 219, 69, 246, 241, 52, 102, 61, 111, 101, 111, 92, 234, 188, 114, 93, 168, 192, 42, 171, 234, 170, 19, 172, 54, 167, 92, 192, 186, 225, 53, 223, 49, 20, 182, 101, 137, 199, 237, 60, 182, 21, 89, 174, 90, 56, 79, 22, 43, 250, 128, 219, 228, 97, 127, 134, 195, 241, 208, 16, 201, 79, 226, 201, 191, 1, 154, 110, 99, 179, 239, 192, 40, 212, 60, 238, 97, 28, 133, 236, 38, 60, 144, 108, 70, 55, 114, 198, 145, 27, 25, 238, 192, 150, 202, 118, 236, 94, 49, 225, 227, 2, 3, 1, 0, 1]);
    var label = new Uint8Array([84, 104, 101, 114, 101, 32, 97, 114, 101, 32, 55, 32, 102, 117, 114, 116, 104, 101, 114, 32, 101, 100, 105, 116, 111, 114, 105, 97, 108, 32, 110, 111, 116, 101, 115, 32, 105, 110, 32, 116, 104, 101, 32, 100, 111, 99, 117, 109, 101, 110, 116, 46]);
    var plaintext = new Uint8Array([95, 77, 186, 79, 50, 12, 12, 232, 118, 114, 90, 252, 229, 251, 210, 91, 248, 62, 90, 113, 37, 160, 140, 175, 231, 60, 62, 186, 196, 33, 119, 157, 249, 213, 93, 24, 12, 58, 233, 148, 38, 69, 225, 216, 47, 238, 140, 157, 41, 75, 60, 177, 160, 138, 153, 49, 32, 27, 60, 14, 129, 252, 71, 202, 207, 131, 21, 162, 175, 102, 50, 65, 19, 195, 182, 98, 48, 195, 70, 8, 196, 244, 89, 54, 52, 206, 2, 178, 103, 54, 34, 119, 240, 168, 64, 202, 116, 188, 61, 26, 98, 54, 149, 44, 94, 215, 170, 248, 168, 254, 203, 221, 250, 117, 132, 230, 151, 140, 234, 93, 42, 91, 159, 183, 241, 180, 140, 139, 11, 229, 138, 48, 82, 2, 117, 77, 131, 118, 16, 115, 116, 121, 60, 240, 38, 170, 238, 83, 0, 114, 125, 131, 108, 215, 30, 113, 179, 69, 221, 178, 228, 68, 70, 255, 197, 185, 1, 99, 84, 19, 137, 13, 145, 14, 163, 128, 152, 74, 144, 25, 16, 49, 50, 63, 22, 219, 204, 157, 107, 225, 104, 184, 72, 133, 56, 76, 160, 62, 18, 96, 10, 193, 194, 72, 2, 138, 243, 114, 108, 201, 52, 99, 136, 46, 168, 192, 42, 171]);
    var ciphertext = {
        "sha-1, no label": new Uint8Array([144, 30, 240, 156, 187, 254, 154, 73, 57, 185, 169, 196, 60, 207, 34, 51, 158, 21, 117, 247, 199, 67, 36, 73, 64, 117, 193, 146, 196, 11, 104, 153, 110, 176, 224, 77, 123, 21, 23, 116, 255, 247, 192, 11, 102, 23, 74, 36, 159, 195, 209, 166, 18, 60, 112, 166, 111, 214, 27, 103, 203, 84, 246, 131, 254, 1, 4, 158, 74, 68, 165, 147, 126, 53, 202, 225, 183, 61, 206, 18, 174, 160, 156, 208, 28, 76, 72, 144, 15, 175, 221, 117, 58, 196, 1, 86, 96, 118, 185, 184, 99, 128, 124, 241, 65, 166, 48, 68, 134, 94, 12, 188, 66, 185, 149, 251, 99, 159, 233, 153, 78, 148, 192, 227, 129, 64, 74, 225, 181, 84, 205, 178, 117, 21, 240, 151, 152, 220, 90, 7, 166, 11, 22, 43, 241, 47, 140, 239, 124, 225, 102, 49, 77, 148, 45, 128, 254, 67, 208, 223, 31, 176, 215, 233, 81, 78, 247, 41, 220, 108, 132, 85, 131, 247, 74, 178, 195, 109, 150, 132, 212, 59, 113, 150, 42, 24, 255, 14, 43, 19, 206, 116, 245, 55, 251, 58, 11, 0, 237, 227, 41, 231, 124, 17, 144, 10, 7, 14, 32, 248, 109, 192, 124, 172, 181, 111, 120, 33, 208, 36, 146, 52, 16, 108, 110, 11, 77, 218, 130, 224, 254, 189, 178, 2, 239, 12, 123, 16, 213, 96, 240, 186, 253, 199, 143, 6, 36, 24, 87, 131, 181, 34, 131, 202, 20, 161]),
        "sha-256, no label": new Uint8Array([5, 49, 234, 235, 75, 140, 239, 142, 183, 125, 215, 54, 208, 150, 182, 220, 232, 64, 209, 100, 233, 117, 31, 134, 168, 213, 206, 208, 153, 153, 80, 111, 250, 240, 0, 235, 97, 83, 247, 69, 111, 49, 26, 233, 158, 71, 241, 32, 113, 80, 235, 151, 242, 152, 45, 183, 115, 190, 158, 153, 14, 138, 18, 152, 90, 95, 17, 90, 249, 6, 239, 12, 135, 14, 239, 60, 159, 202, 28, 91, 77, 94, 153, 4, 153, 182, 125, 0, 148, 173, 175, 141, 235, 223, 154, 93, 114, 51, 91, 84, 179, 209, 202, 38, 234, 9, 87, 214, 62, 6, 76, 233, 105, 213, 46, 83, 189, 96, 92, 143, 169, 50, 13, 158, 171, 226, 57, 238, 244, 112, 153, 85, 92, 25, 77, 27, 184, 223, 239, 254, 173, 107, 79, 215, 248, 242, 137, 144, 53, 92, 200, 238, 34, 163, 108, 72, 103, 240, 172, 234, 215, 244, 165, 2, 95, 21, 23, 247, 82, 167, 232, 192, 147, 83, 61, 12, 214, 89, 173, 96, 167, 220, 5, 4, 66, 32, 1, 152, 135, 1, 100, 55, 220, 201, 76, 111, 158, 130, 2, 176, 59, 201, 85, 235, 44, 121, 13, 63, 183, 199, 231, 126, 38, 18, 255, 165, 33, 218, 244, 103, 246, 64, 167, 73, 233, 225, 25, 21, 116, 190, 118, 226, 213, 92, 60, 254, 122, 147, 85, 26, 124, 40, 221, 178, 186, 107, 38, 195, 58, 48, 194, 55, 28, 216, 151, 77]),
        "sha-384, no label": new Uint8Array([12, 35, 146, 227, 15, 146, 241, 244, 228, 172, 209, 180, 166, 253, 153, 249, 131, 198, 29, 202, 243, 155, 221, 222, 71, 178, 158, 173, 58, 221, 16, 74, 122, 134, 223, 31, 112, 153, 243, 104, 60, 101, 175, 254, 50, 157, 43, 202, 185, 80, 53, 236, 150, 193, 61, 171, 154, 12, 180, 185, 89, 96, 254, 224, 138, 165, 131, 85, 102, 161, 181, 125, 223, 84, 90, 201, 80, 80, 145, 52, 206, 208, 2, 115, 158, 166, 255, 62, 61, 228, 132, 31, 159, 169, 6, 22, 96, 236, 241, 5, 51, 233, 245, 12, 165, 22, 79, 50, 73, 68, 204, 123, 142, 58, 236, 105, 152, 163, 102, 249, 12, 250, 238, 121, 119, 101, 26, 13, 30, 141, 25, 75, 205, 28, 42, 0, 135, 41, 170, 1, 26, 157, 13, 140, 162, 113, 249, 142, 1, 91, 244, 102, 188, 217, 156, 217, 118, 134, 181, 146, 246, 111, 177, 54, 159, 84, 163, 88, 147, 122, 188, 249, 23, 223, 111, 57, 186, 220, 111, 95, 246, 48, 199, 172, 115, 185, 47, 173, 186, 221, 12, 41, 252, 224, 76, 167, 214, 42, 171, 82, 178, 100, 229, 162, 130, 188, 191, 2, 114, 28, 17, 158, 40, 233, 66, 108, 217, 150, 179, 121, 25, 115, 216, 162, 172, 244, 58, 44, 47, 103, 255, 136, 76, 26, 119, 184, 63, 195, 38, 140, 100, 12, 171, 65, 67, 54, 195, 31, 122, 105, 119, 228, 149, 16, 49, 212]),
        "sha-512, no label": new Uint8Array([6, 38, 211, 70, 213, 37, 49, 19, 221, 192, 248, 206, 209, 145, 141, 136, 235, 240, 8, 105, 248, 128, 175, 137, 197, 230, 123, 179, 121, 75, 181, 138, 155, 246, 25, 229, 165, 89, 9, 65, 143, 108, 126, 20, 168, 88, 160, 197, 48, 66, 117, 2, 219, 122, 254, 96, 36, 147, 170, 111, 123, 168, 57, 151, 25, 139, 10, 233, 125, 219, 141, 58, 125, 174, 89, 38, 220, 25, 15, 5, 135, 69, 33, 5, 10, 49, 28, 253, 148, 251, 213, 53, 223, 8, 184, 64, 185, 94, 249, 211, 64, 53, 131, 136, 32, 2, 163, 61, 76, 9, 162, 189, 80, 71, 109, 237, 147, 9, 11, 147, 61, 254, 1, 185, 208, 228, 44, 219, 17, 163, 239, 184, 212, 197, 229, 210, 35, 236, 4, 117, 37, 187, 169, 26, 248, 95, 160, 165, 252, 21, 102, 253, 73, 115, 145, 124, 88, 143, 121, 128, 236, 70, 144, 101, 181, 54, 179, 64, 57, 232, 153, 72, 158, 96, 241, 79, 255, 90, 67, 16, 110, 43, 234, 153, 20, 57, 75, 83, 23, 184, 216, 25, 215, 52, 9, 241, 114, 21, 223, 184, 177, 247, 66, 98, 13, 15, 175, 204, 82, 81, 205, 22, 15, 92, 28, 99, 186, 234, 241, 33, 37, 210, 15, 8, 197, 30, 208, 97, 7, 42, 51, 173, 213, 171, 59, 154, 71, 53, 78, 88, 244, 50, 157, 33, 111, 143, 185, 61, 91, 118, 237, 245, 93, 91, 156, 36]),
        "sha-1, with label": new Uint8Array([69, 12, 147, 43, 219, 95, 34, 61, 29, 64, 218, 190, 133, 69, 125, 35, 8, 73, 73, 154, 87, 194, 91, 201, 130, 111, 243, 86, 90, 124, 254, 130, 187, 133, 158, 32, 159, 234, 150, 98, 91, 246, 120, 166, 57, 233, 98, 7, 160, 58, 125, 113, 53, 79, 2, 202, 208, 104, 123, 195, 27, 84, 250, 98, 8, 169, 83, 207, 94, 31, 97, 31, 81, 0, 247, 153, 208, 99, 64, 185, 244, 213, 194, 62, 200, 171, 78, 245, 10, 62, 144, 176, 206, 94, 104, 172, 45, 57, 114, 196, 243, 166, 34, 67, 137, 41, 77, 6, 32, 225, 9, 234, 183, 32, 38, 40, 26, 93, 230, 191, 27, 192, 183, 67, 224, 156, 64, 189, 36, 27, 216, 57, 58, 164, 48, 164, 74, 218, 167, 196, 208, 221, 79, 102, 118, 23, 123, 26, 227, 53, 185, 196, 14, 233, 154, 6, 140, 233, 204, 153, 109, 163, 164, 226, 170, 207, 79, 123, 26, 188, 129, 124, 98, 82, 255, 95, 142, 71, 26, 5, 215, 198, 129, 179, 110, 130, 251, 222, 140, 210, 226, 37, 200, 117, 100, 172, 26, 138, 97, 11, 87, 161, 104, 210, 68, 117, 46, 87, 74, 250, 152, 86, 194, 42, 117, 122, 254, 235, 202, 150, 249, 63, 110, 109, 23, 197, 32, 81, 89, 39, 217, 156, 163, 78, 237, 253, 25, 188, 227, 31, 35, 174, 190, 21, 157, 160, 37, 60, 39, 193, 11, 92, 15, 251, 125, 151]),
        "sha-256, with label": new Uint8Array([180, 212, 109, 8, 118, 130, 24, 5, 96, 121, 113, 102, 114, 157, 149, 31, 234, 5, 95, 138, 184, 10, 16, 249, 49, 78, 85, 222, 225, 47, 172, 108, 33, 36, 206, 47, 211, 159, 202, 241, 52, 172, 221, 28, 99, 1, 176, 51, 82, 146, 190, 137, 163, 202, 212, 74, 150, 204, 58, 26, 43, 54, 135, 91, 246, 201, 59, 106, 181, 9, 10, 118, 191, 106, 122, 102, 175, 114, 2, 182, 146, 169, 55, 124, 84, 187, 254, 237, 225, 252, 32, 197, 79, 97, 219, 250, 54, 81, 52, 121, 146, 194, 13, 196, 88, 212, 7, 146, 237, 232, 31, 113, 215, 200, 42, 158, 239, 180, 51, 152, 214, 145, 106, 11, 115, 160, 21, 71, 171, 190, 45, 25, 229, 19, 130, 210, 52, 58, 14, 55, 82, 250, 215, 193, 110, 178, 143, 101, 163, 63, 149, 216, 176, 163, 145, 66, 239, 62, 204, 195, 102, 14, 157, 2, 155, 114, 230, 225, 55, 121, 167, 172, 182, 187, 75, 149, 49, 213, 104, 144, 202, 230, 111, 125, 119, 236, 213, 155, 131, 122, 43, 55, 245, 183, 60, 140, 103, 88, 45, 84, 157, 247, 67, 243, 169, 102, 176, 225, 192, 181, 154, 252, 90, 95, 17, 161, 112, 96, 196, 105, 104, 55, 6, 92, 212, 18, 127, 85, 190, 12, 105, 123, 219, 110, 130, 111, 179, 32, 183, 81, 246, 240, 135, 59, 5, 210, 173, 15, 102, 215, 87, 95, 136, 136, 238, 12]),
        "sha-384, with label": new Uint8Array([204, 60, 188, 131, 15, 114, 86, 246, 190, 155, 206, 62, 68, 249, 98, 63, 178, 144, 1, 244, 42, 248, 47, 9, 253, 8, 139, 186, 215, 180, 191, 92, 247, 19, 146, 242, 65, 195, 105, 211, 136, 84, 225, 236, 75, 202, 243, 148, 197, 68, 115, 51, 135, 65, 180, 62, 123, 91, 27, 67, 133, 14, 183, 65, 49, 1, 6, 94, 114, 249, 66, 36, 250, 189, 73, 218, 155, 213, 204, 240, 103, 185, 206, 189, 80, 60, 249, 1, 127, 190, 28, 196, 167, 67, 123, 222, 203, 124, 205, 153, 251, 242, 77, 151, 213, 215, 162, 189, 31, 28, 244, 1, 167, 58, 3, 169, 93, 143, 27, 40, 167, 86, 225, 85, 59, 93, 176, 82, 209, 224, 144, 21, 35, 252, 182, 97, 115, 200, 70, 117, 109, 240, 175, 102, 208, 100, 124, 230, 180, 232, 159, 77, 176, 75, 139, 58, 57, 254, 13, 183, 25, 27, 246, 182, 51, 171, 197, 226, 26, 7, 105, 225, 238, 147, 61, 68, 102, 97, 247, 149, 39, 8, 68, 70, 215, 220, 205, 74, 195, 183, 112, 152, 91, 70, 122, 163, 30, 66, 51, 52, 190, 204, 209, 223, 111, 67, 44, 18, 14, 108, 156, 62, 165, 221, 6, 246, 148, 233, 148, 50, 217, 248, 44, 99, 233, 118, 235, 248, 78, 45, 202, 61, 211, 220, 193, 74, 6, 229, 203, 212, 114, 116, 242, 214, 85, 165, 199, 114, 125, 53, 5, 87, 238, 208, 145, 184]),
        "sha-512, with label": new Uint8Array([134, 151, 181, 94, 239, 91, 13, 83, 17, 57, 138, 21, 242, 206, 24, 86, 184, 239, 238, 57, 231, 116, 113, 139, 12, 128, 104, 100, 147, 57, 228, 183, 167, 225, 41, 180, 247, 133, 141, 0, 121, 193, 235, 168, 184, 248, 107, 34, 34, 233, 97, 215, 247, 240, 20, 245, 14, 0, 167, 17, 235, 204, 81, 97, 52, 81, 9, 136, 91, 59, 122, 200, 249, 74, 63, 68, 10, 18, 162, 243, 10, 190, 118, 60, 24, 74, 231, 92, 98, 179, 221, 150, 5, 66, 78, 93, 200, 212, 29, 76, 50, 246, 190, 84, 7, 245, 176, 148, 97, 5, 16, 22, 222, 173, 165, 200, 169, 93, 58, 8, 123, 229, 124, 220, 66, 123, 34, 69, 49, 33, 25, 107, 32, 250, 98, 61, 41, 222, 108, 112, 37, 42, 178, 163, 81, 157, 28, 160, 3, 121, 88, 10, 249, 25, 25, 22, 66, 0, 36, 187, 176, 199, 154, 122, 138, 43, 72, 217, 90, 43, 119, 50, 210, 166, 202, 2, 121, 172, 24, 172, 51, 74, 161, 45, 107, 150, 187, 89, 9, 89, 183, 233, 169, 149, 78, 145, 228, 156, 138, 215, 232, 219, 33, 33, 224, 178, 174, 16, 6, 72, 185, 214, 34, 204, 159, 161, 154, 11, 151, 142, 39, 244, 74, 75, 243, 191, 123, 231, 32, 54, 118, 235, 12, 19, 200, 165, 252, 161, 87, 46, 99, 51, 248, 146, 180, 122, 44, 210, 103, 237, 169, 50, 28, 210, 121, 136])
    };
    var passing = [
        {
            name: "RSA-OAEP with SHA-1 and no label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP"},
            hash: "SHA-1",
            plaintext: plaintext.slice(0, 214),
            ciphertext: ciphertext["sha-1, no label"]
        },
        {
            name: "RSA-OAEP with SHA-256 and no label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP"},
            hash: "SHA-256",
            plaintext: plaintext.slice(0, 190),
            ciphertext: ciphertext["sha-256, no label"]
        },
        {
            name: "RSA-OAEP with SHA-384 and no label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP"},
            hash: "SHA-384",
            plaintext: plaintext.slice(0, 158),
            ciphertext: ciphertext["sha-384, no label"]
        },
        {
            name: "RSA-OAEP with SHA-512 and no label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP"},
            hash: "SHA-512",
            plaintext: plaintext.slice(0, 126),
            ciphertext: ciphertext["sha-512, no label"]
        },
        {
            name: "RSA-OAEP with SHA-1 and empty label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP", label: new Uint8Array([])},
            hash: "SHA-1",
            plaintext: plaintext.slice(0, 214),
            ciphertext: ciphertext["sha-1, no label"]
        },
        {
            name: "RSA-OAEP with SHA-256 and empty label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP", label: new Uint8Array([])},
            hash: "SHA-256",
            plaintext: plaintext.slice(0, 190),
            ciphertext: ciphertext["sha-256, no label"]
        },
        {
            name: "RSA-OAEP with SHA-384 and empty label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP", label: new Uint8Array([])},
            hash: "SHA-384",
            plaintext: plaintext.slice(0, 158),
            ciphertext: ciphertext["sha-384, no label"]
        },
        {
            name: "RSA-OAEP with SHA-512 and empty label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP", label: new Uint8Array([])},
            hash: "SHA-512",
            plaintext: plaintext.slice(0, 126),
            ciphertext: ciphertext["sha-512, no label"]
        },
        {
            name: "RSA-OAEP with SHA-1 and a label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP", label: label},
            hash: "SHA-1",
            plaintext: plaintext.slice(0, 214),
            ciphertext: ciphertext["sha-1, with label"]
        },
        {
            name: "RSA-OAEP with SHA-256 and a label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP", label: label},
            hash: "SHA-256",
            plaintext: plaintext.slice(0, 190),
            ciphertext: ciphertext["sha-256, with label"]
        },
        {
            name: "RSA-OAEP with SHA-384 and a label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP", label: label},
            hash: "SHA-384",
            plaintext: plaintext.slice(0, 158),
            ciphertext: ciphertext["sha-384, with label"]
        },
        {
            name: "RSA-OAEP with SHA-512 and a label",
            publicKeyBuffer: spki,
            publicKeyFormat: "spki",
            privateKey: null,
            privateKeyBuffer: pkcs8,
            privateKeyFormat: "pkcs8",
            publicKey: null,
            algorithm: {name: "RSA-OAEP", label: label},
            hash: "SHA-512",
            plaintext: plaintext.slice(0, 126),
            ciphertext: ciphertext["sha-512, with label"]
        }
    ];
    var failing = [];
    return {passing: passing, failing: failing};
}
